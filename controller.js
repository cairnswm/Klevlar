
// Singleton
class klevlarControl {
    constructor() {
        this.elements = [];
        self = this;        
        ['submit', 'click','change'].forEach(eventname => {
            document.addEventListener(eventname, (e) => { this.eventHandler(e) }, false);        
        });
    }
    eventHandler = (e) => {
        let element = this.elements[e.target.id];
        if (e.type === "submit") { 
            e.preventDefault();
        }
        if (element) {
            if (element.event && element.event[e.type]) {
                element.event[e.type](e);
            }
        }
    }
    get = (tempId) => {
        return this.elements.find(element => element.obj.id === tempId);
    }
}

// singleton
class klevlarStore {
    setValue = (name, value) => {
        localStorage.setItem(name, value);
    }
    getValue = (name) => {
        return localStorage.getItem(name);
    }
    get token() {
        return localStorage.getItem('token');
    }
    set token(value) {
        return localStorage.setItem('token',value);
    }
    tokenData (token) {
        if (!token) {
            token = localStorage.getItem('token');
        }
        if (!token) {
            return {}
        }
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };
    
    // fetchData passes the token as part of the headers. should only be used if Tokens are used by the application else do normal ajax call
    fetchData = async (url = '', mode = "GET", data = {}) => {
        const response = await fetch(url, {
          method: mode, // GET, POST, PUT, DELETE.
          cache: 'no-cache', 
          body: (mode !== "GET" ? JSON.stringify(data) : undefined),
          headers: {
            'Content-Type': 'application/json',
            "token": localStorage.getItem('token')
          }
        });
        if (mode === "POST" || mode === "PUT") { return response; }
        return response.json(); // parses JSON response into native JavaScript objects
      }
    secureGet = async (url) => { 
        let res;
        res = await this.fetchData(url);
        return res;
    }
    securePost = async (url, data) => { 
        let res;
        res = await this.fetchData(url, "POST", data);
        return res;
    }
    securePut = async (url, data) => { 
        let res;
        res = await this.fetchData(url, "PUT", data);
        return res;
    }
}
const controller = new klevlarControl();
const store = new klevlarStore();
