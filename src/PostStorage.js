import { web3, timeConverter } from "./Web3";

const root = 10;

class PostStorage {

  posts = [];
  subscribers = new Set();
  latest_id = -1;
  
  insertPost(post) {
    const pos = this.posts.findIndex((p) => {
      return p.created > post.created;
    });

    if (pos >= 0) {
      this.posts.splice(pos, 0, post);
    } else {
      this.posts.push(post);
    }
  }

  newPost(component, post) {
    if (!window.ethereum) {
      return;
    } else {
      window.ethereum.enable();
    }

    (async () => {
      try {
        web3.noncense.methods.newPost(post.body, root, "", "", false).send({ from: window.ethereum.selectedAddress })
        .on("transactionHash", (hash) => {
          component.body.value = "";

          const now = new Date().getTime() / 1000;
          post = {
            ...post,
            id: hash,
            author: window.ethereum.selectedAddress,
            body: '[PENDING] ' + post.body,
            created: now,
            date: timeConverter(now),
            children: 0,
          };
          this.insertPost(post);
          this.publish();
        });
      } catch (e) {
        console.error(e);
      }
    })();
  }

  async getPost(id, recursive = false, depth = 0) {
    let existing = this.posts.find((post) => {
      return post.id === id;
    });
    let notFound = !existing;

    let post;
    if (notFound) {
      let cached = window.localStorage.getItem(id.toString());
      if (cached) {
        post = JSON.parse(cached);
      }
    }

    if (notFound) {
      if (!post) {
        post = await web3.noncense.methods.post(id).call();
      }
      this.insertPost({
        ...post,
        id: id,
        date: timeConverter(post.created),
      });

      (async () => {
        window.localStorage.setItem(id.toString(), JSON.stringify(this.posts[this.posts.length-1]));
      })();
    }

    if (recursive && post.children > 0) {
      let ids = await web3.noncense.methods.getIdsByParentId(id, 0, 0).call();

      for (let cid of ids) {
        notFound |= await this.getPost(cid, recursive, depth+1);
      }
    }

    if (id >= this.latest_id) {
      this.latest_id = id;
    }

    return notFound;
  }

  async reload() {
    this.posts = [];

    let ids = await web3.noncense.methods.getIdsByParentId(root, 0, 0).call();
    let needPublish = false;


    let revIds = [...ids].reverse();

    for (let id of revIds) {
      needPublish |= await this.getPost(id);
    }

    if (needPublish) {
      this.publish();
    }
  }

  constructor() {
    if (web3.http.eth.currentProvider.host) {
      console.debug("Connecting to", web3.http.eth.currentProvider.host);
    } else {
      console.debug("Connecting by injected Web3");
    }

    web3.http.eth.net.isListening().then(() => {
      this.reload();
    });

    web3.ws.eth.net.isListening().then(() => {
      web3.noncense.events.PostUpdated({ fromBlock: "latest" }, (error, result) => {
        if (error) {
          console.error(error);
          return;
        }

        console.log(result);

        if (parseInt(result.returnValues.parentId) !== root) {
          return;
        }

        let id = parseInt(result.returnValues.id);

        let existing = this.posts.find((post) => {
          return post.id === result.transactionHash;
        });

        if (existing) {
          existing.id = result.returnValues.id;
          existing.body = existing.body.slice(10);
          this.publish();
        } else if (id > this.latest_id) {
          (async () => {
            let needPublish = await this.getPost(id);
            if (needPublish) {
              this.publish();
            }
          })();
        }
      });
    });
  }

  subscribe(component, defer = false) {
    this.subscribers.add(component);
    if (!defer) {
      this.publish();
    }
  }

  unsubscribe(component) {
    this.subscribers.delete(component);
  }

  publish() {
    for (let component of this.subscribers) {
      component.setState({ posts: this.posts });
    }
  }
}

let postStorage = new PostStorage();

export { postStorage };
