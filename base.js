/* 
  Klevlar base classes

  Developed by William Cairns - January 2021
  License: MIT
*/  

// baseFunctions is the root class of all Klevlar classes
class baseFunctions {    
    constructor() {
        this.event = [];
        this.id = this.randomString(8); // Generate a unique ID
        controller.elements[this.id] = this;
    }
    // Generate random string - always starts with an Alpha - used for Generating Random Ids
    randomString(length) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz0123456789'.split('');
    
        if (!length) {
            length = 8;
        }
    
        var str = chars[Math.floor(Math.random() * 52)];
        for (var i = 1; i < length; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    }
    // Allows triggering of event (eg when click...)
    when = (type, func) => {
        console.log("when",this.constructor.name, type, func);
        this.event[type] = func;
        return this;
    }   
    // sets internal variables
    setVar = (name, value) => {
        this[name] = value;   
        return this;
    }
    // gets internal variable
    getVar = (name) => {
        return this[name];   
    }
}

// Base class is used for all elements that are directly linked to a identified element on the page
class Base extends baseFunctions {
    constructor(elem) {
        super();
        if (elem) {
            this.elem = document.getElementById(elem);
        }
        this.class = ``;
    }
    async show() {
        $(this.elem).show();
        this.render();
    }
    render() {
        let html = "<h2>Base</h2>";
        if (!this.elem) {
            return html;
        }
        this.elem.innerHTML = "<h2 class='${this.class}'>Base</h2>";
    }
}

// Item is base class for all items not linked to a identified elemnt in the page. These are injected when their parent container are updated
class Item extends baseFunctions {
    constructor() {
        super();
    }
    render() {
        return "<h2>Item</h2>";
    }
    refresh = async () => {
        let html = await this.render();
        $('#'+this.id).replaceWith(html);
    }
    isreadonly = (value = false) => {
        this.readonly = value;
        return this;
    }
    value = () => {
        return;
    }
}

class Button extends Item {
    constructor(name) {
        super();
        this.name = name; 
        this.class="btn btn-primary";
        return this;
    }
    onClick(func) {
        this.when("click",func);
        return this;
    }
    render() {
        return `<button id="${this.id}" class='${this.class}' type="button">${this.name}</button>`;
    }
}

class Select extends Item {
    constructor(label, name, options, def) {
        super();
        this.name = name;
        this.label = label;
        this.options = options;
        this.defaultvalue = def;
        this.class = "row";
        return this;
    }
    value = () => {
        return document.getElementById(`${this.id}.value`).value;
    }
    render = async () => {
        let opts = '';
        
        let req = this.required ? "required" : "";
        let ro = this.readonly ? "readonly" : "";

        if (this.populate) {
            let x = await this.populate();
            this.options = x;
        }
        let def = this.defaultvalue;
        this.options.forEach(opt => {
            if (typeof opt === "string") {
                let sel = (opt == def) ? "selected" : "";
                opts += `<option value="${opt}" ${sel}>${opt}</option>`
            } else if (typeof opt === "object") {  
                let sel = (opt.value == def || opt.text == def) ? "selected" : "";              
                opts += `<option value="${opt.value}" ${sel}>${opt.text}</option>`
            }
        })        
        return `<div class='${this.class}'>
            <div class="col-4">
                <label for="${this.name}" ${req}>${this.label}</label>
            </div>
            <div class="col-8">
                <select class="form-select" name="${this.name}" id="${this.id}.value" ${req} ${ro}>${opts}</select>
            </div>
        </div>`
    }
}

class Input extends Item {
    constructor(label, name = undefined, inputtype = 'text', defaultvalue = '') {
        super();
        if (!name) {
            name = this.id;
        }
        this.name = name;
        this.label = label;
        this.inputtype = inputtype;
        this.defaultvalue = defaultvalue;
        this.validate = (name, value) => { return true; }
        this.class = "row";
        return this;
    }
    value = () => {
        return document.getElementById(`${this.id}.value`).value;
    }
    render() {
        let req = this.required ? "required" : "";
        let def = this.populate ? this.populate() : this.defaultvalue;
        let ro = this.readonly ? "readonly" : "";
        return `<div id="${this.id}" class='${this.class}'>` +
            (this.inputtype !== "hidden" ? `<div class="col-4">
                <label for="${this.name}">${this.label}</label>
            </div>` : ``) + 
            `<div class="col-8">
                <input class="form-control" type="${this.inputtype}" name="${this.name}" id="${this.id}.value" value="${def}" ${req} ${ro} />
            </div>
        </div>`;
    }
}

class Text extends Item {
    constructor(text) {
        super();
        this.text = text;
        return this;
    }
    setText = (newText) => {
        this.text = newText;
        this.refresh();
    }
    value = () => {
        return this.text;
    }
    render() {
        return `<span id="${this.id}" class='${this.class}'>${this.text}</span>`;
    }
}

class Header extends Text {
    constructor(text, level) {
        super(text);
        this.level = level;
        return this;
    }
    render() {
        return `<h${this.level} id="${this.id}" class='${this.class}'>${this.text}</h${this.level}>`;
    }
}

class Modal extends Item {
    constructor(header, display) {
        super();
        this.active = "";
        this.header = header;
        this.display = display;
        this.class = "row";
        return this;
    }
    activate(mode = true) {
        this.active = mode ? "active" : "";
        this.refresh();
    }
    close() {
        this.activate(false)
    }
    open() {
        this.activate(true)
    }
    async render() {
        return `<div class='${this.class}'>
            <div class="modal ${this.active}" click="(e) => {e.preventDefault()}">
                <div class="modalview shadow" id="${this.id}">
                    <h1 class="modalheader">
                        ${this.header}
                    </h1>
                    <div class="modalbody">
                        ${await this.display.render()}
                    </div>
                </div>
            </div></div>`
    }
}

class Alert extends Item {
    constructor(name) {
        super();
        this.name = name;
        this.text = "";
        this.type = "";
        this.on('click',(e) => { this.text = "" });
        return this;
    }
    onClick(func) {
        this.on("click",func);
        return this;
    }
    render() {
        return `<div id="${this.id}" class="${this.type} ${this.class}" type="" name="${this.name}">${this.text}</div>`;
    }
}

// Allows the cration of any tag into the Page/form. Specifically used for items such as Canvas
class HTMLTag extends Item {
    constructor(tagtype, content) {
        super();
        this.tagtype = tagtype;
        this.content = content;
        this.class = "row";
        return this;
    }
    onClick(func) {
        this.on("click",func);
        return this;
    }
    render() {
        return `<div class='${this.class}'><div class="col-12"><${this.tagtype} id="${this.id}">${this.content}</${this.tagtype}></div></div>`;
    }
}

class Container extends Item {
    constructor() {
        super();
        this.elems = [];
        this.last = undefined;
        return this;
    }
    addInput(label, name, inputtype = 'text', defaultvalue = '') { 
        let input = new Input(label, name, inputtype, defaultvalue);
        this.last = input;
        this.elems.push({type: "input", obj: input });
        return this;
    }
    addHeader(header, level = 1) {
        header = new Header(header,level);
        this.last = header;
        this.elems.push({type: "header", obj: header});
        return this;
    }
    addHtml(htmltag,content) {
        let tag = new HTMLTag(htmltag,content);
        this.last = tag;
        this.elems.push({type: "html", obj: tag });
        return this;
    }
    addText(text) {        
        let txt = new Text(text);
        this.last = txt;
        this.elems.push({type: "text", obj: txt });
        return this;
    }
    addAlert(text) {
        let alert = new Alert(text);
        this.elems.push({type: "alert", obj: alert });
        this.last = alert;
        return this;
    }
    addButton(text, func) {
        let button = new Button(text);
        button.onClick(func);
        this.elems.push({type: "button", obj: button });
        this.last = button;
        return this;
    }
    addSelect(label, name, options = []) {
        let select = new Select(label, name, options);
        this.elems.push({type:"select", obj: select});
        this.last = select;
        return this;
    }
    addContainer() {
        let container = new Container(...arguments);
        this.elems.push({type:"container", obj: container});
        this.last = container;
        return this;
    }
    addElem(item) {
        this.elems.push({type: item.type ? item.type : "item", obj: item});
        this.last = item;
        return this;
    }
    addModal() {
        let modal = new Modal(...arguments);
        this.elems.push({type:"select", obj: modal});
        this.last = modal;
        return this;
    }
    class(classString) {
        this.last.class = classString;
        return this;
    }
    // mark latest input as required
    required(value = true) {
        this.last.required = value;
        return this;
    }
    readonly(value = true) {
        this.last.readonly = value;
        return this;
    }
    // call fun to validate the input (on submit)
    validate(func) {
        this.last.validate = func;
        return this;
    }
    // Acts the same as .when but allows a 'when' to be added to the current chained item
    on(eventtype, func) {
        this.last.event[eventtype] = func;
        return this;
    }
    default(val) {
        this.last.defaultvalue = val;
        return this;
    }
    // Call func when needing a initial value for the input value
    populate(func) {
        this.last.populate = func;
        return this;
    }
    setEvent = (name,func) => {
        this.event[name] = func;  
        return this; 
    }
    callEvent = (name, params) => {
        if (this.event[name]) {
            this.event[name](params);
        }
    }
    // Extracts an object with values for each input in the form - used for submitting data to the backend
    value = () => {
        var elements = this.elems;
        let data = {}
        for (var i = 0, element; element = elements[i++];) {
            if (element.obj.name) {
                if (element.type != "submit" && element.type != "button") {
                    data[element.obj.name] = $("#"+element.obj.id).val();
                }
            }
        }
        return data;
    }
        
    refId = (newId) => {
        if (this.last) {
            delete(controller.elements[this.last.id]);
            if (this.last.name && this.last.name === this.last.id) {
                this.last.name = newId;
            }
            this.last.id = newId;
            controller.elements[newId] = this.last;
        } else {
            delete(controller.elements[this.id]);
            this.id = newId;
            controller.elements[newId] = this;
        }
        return this
    }
    get = (tempId) => {
        return this.elems.find(item => (item.obj ? item.obj.id === tempId : undefined)).obj;
    }
    _getrender = async () => {
        let html = `<div id="${this.id}" class="${this.controlGroup}">`;
        let buttons = ``;
        if (this.elems) {
            for (let index in this.elems) {
                let element = this.elems[index]        
                if (element.type === "button") {
                    buttons += await element.obj.render();
                }  else {
                    html += await element.obj.render();
                }        
            };
            html += `<div class="row row-btns"><div class="col-12 col-md-12">${buttons}</div></div>`;
        }
        html += "</div>";
        return html;
    }
    render = async () => {
        let html = await this._getrender();
        return html;
    }
}

// Basic functionality for building a form in a chained declarative format
// I considered using more generic functions with complex configuration object but decided to keep it all simple functions
class Page extends Container {
    constructor(elem, controlGroup = "KlevlarDefault") {
        super();
        this.elem = document.getElementById(elem);
        this.controlGroup = controlGroup;
        return this;
    }
    show = async () => {
        $(this.elem).show();
        this.render();
        // setTimeout needed to give Browser chance to update and set ids etc before triggering afterShow
        setTimeout(() => {
            if (this.event["afterShow"]) { 
                this.event["afterShow"]();
            }
        },25);
    }
    render = async () => {
        let html = await this._getrender();
        if (!this.elem) {
            return html;
        }
        this.elem.innerHTML = html;
    }
    
}

class Form extends Page {
    constructor(elem, controlGroup = "KlevlarDefault") {
        super(elem, controlGroup);
        this.event["submit"] = this._submit;
    }
    onSubmit(func) {
        this.customSubmit = func;
        return this;
    }
    _submit = (e) => {
        e.preventDefault();
        if (this.customSubmit) {            
            // create a response object to allow submit function to save the data
            var elements = e.target.elements;
            let data = {}
            let passedAllValidations = true;
            for (var i = 0, element; element = elements[i++];) {
                if (element.name) {                    
                    // find the internal element and validate it
                    let elem = this.elems.find(item => item.obj && item.obj.name === element.name);
                    if (elem && elem.obj){
                        if (typeof elem.obj.validate === "function") {
                            let elementValidation = elem.obj.validate(elem.obj.name, element.value);
                            passedAllValidations = passedAllValidations && elementValidation;
                        }
                        if (element.type != "submit") {
                            data[element.name] = elem.obj.value();
                            //data[element.name] = $("#"+element.id).val();
                        }
                        
                    }
                }
            }
            if (passedAllValidations) {
                this.customSubmit(e, data);
            } else {
                return false;
            }
        }
    }
    render = async () => {
        let html = `<form id="${this.id}" class="${this.controlGroup}">`;
        html += await this._getrender();
        html += "</form>";
        if (!this.elem) {
            return html;
        }
        this.elem.innerHTML = html;
    }
}

class PageController extends Base {
    constructor(elem) {
        console.log("PageController")
        super(elem);
        this.pages = [];
        this.activePage = "";
        this.last;
        return this;
    }
    addPage(pageName, page, isDefault = false) {
        console.log(this.activePage)
        this.pages[pageName] = page;
        if (isDefault || !this.activePage) {
            this.activePage = page;
            this.activePageName = pageName;
        }
        this.last = page;
        return this;
    }
    setPage(pageName) {
        this.activePage = this.pages[pageName];
        this.activePageName = pageName;
        this.show();
        return this;
    }
    on(type, func) {
        this.last.when(type,func);
        return this;
    }
    async render () {
        console.log(this);
        let html = await this.activePage.render();
        this.elem.innerHTML = html;
    }
}