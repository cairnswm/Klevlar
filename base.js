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
        this.classes = ``;
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
        this.elem.innerHTML = `<h2 class='${this.classes}'>Base</h2>`;
    }
}

// Item is base class for all items not linked to a identified elemnt in the page. These are injected when their parent container are updated
class Item extends baseFunctions {
    constructor() {
        super();
        this.classes = '';
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
    setId(newId) {
        if (this.name && this.name === this.id) {
            this.name = newId;
        }
        this.id = newId;

        return this
    }
    set class(classString) {
        this.classes = classString;
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
        if (this.last) {
            this.last.classes = classString;
        } else {
            this.classes = classString;
        }
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
            this.last.setId(newId);
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
        let html = `<div id="${this.id}" class="${this.classes}">`;
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


class Button extends Item {
    constructor(name) {
        super();
        this.name = name; 
        this.classes="btn btn-primary";
        return this;
    }
    onClick(func) {
        this.when("click",func);
        return this;
    }
    render() {
        return `<button id="${this.id}" class='${this.classes}' type="button">${this.name}</button>`;
    }
}

class Select extends Item {
    constructor(name, options, def) {
        super();
        this.name = name;
        this.options = options;
        this.defaultvalue = def;
        this.classes = "row";
        this.validate = (name, value) => { 
            return true; 
        }
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
            if (typeof opt === "string" || typeof opt === "number") {
                let sel = (opt == def) ? "selected" : "";
                opts += `<option value="${opt}" ${sel}>${opt}</option>`
            } else if (typeof opt === "object") {  
                let sel = (opt.value == def || opt.text == def) ? "selected" : "";              
                opts += `<option value="${opt.value}" ${sel}>${opt.text}</option>`
            }
        })        
        return `<select class='${this.classes}' class="form-select" name="${this.name}" id="${this.id}.value" ${req} ${ro}>${opts}</select>`
    }
}


class Input extends Item {
    constructor(name = undefined, inputtype = 'text', defaultvalue = '') {
        super();
        if (!name) {
            name = this.id;
        }
        this.name = name;
        this.inputtype = inputtype;
        this.defaultvalue = defaultvalue;
        this.validate = (name, value) => { 
            return true; 
        }
        this.classes = "row";
        return this;
    }
    value = () => {
        return document.getElementById(`${this.id}.value`).value;
    }
    render() {
        let req = this.required ? "required" : "";
        let def = this.populate ? this.populate() : this.defaultvalue;
        let ro = this.readonly ? "readonly" : "";
        return `<input class="form-control" type="${this.inputtype}" name="${this.name}" id="${this.id}.value" value="${def}" ${req} ${ro} />`;
    }
}

class Label extends Item {
    constructor(text, forInput) {
        super();
        this.text = text;
        this.for, forInput;
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
        return `<Label id="${this.id}" class='${this.classes}' for='${this.for}'>${this.text}</span>`;
    }
}

class FormControl extends Item {
    constructor(label, name = undefined) {
        super();
        if (!name) {
            name = randomString(10);
        }
        this.name = name;
        this.label = new Label(label, name);
        this.input;
        this.validate = (name, value) => { 
            return this.input.validate(name,value); 
        }
        this.value = () => { 
            return this.input.value(); 
        }
        this.classes = "row";
    }
    set readonly(val) {
        this.input.readonly = val;
    }
    set required(val) {
        this.input.required = val;
    }
    set defaultvalue(val) {
        if (this.input) {
            this.input.defaultvalue = val;
        }
    }
    set populate(func) {        
        if (this.input) {
            this.input.populate = func;
        }
    }
    set readonly(value) {
        this.input.readonly = value;
    }
    set required(value) {
        this.input.required = value;
    }
    setId(newId) {
        super.setId(newId);
        this.label.setId(newId+"label");
        this.input.setId(newId);
    }
    render = async() => {
        return `<div name="${this.name}" id="${this.id}" class='${this.classes}'>` +
            (this.inputtype !== "hidden" ? `<div class="col-4">
                ${this.label.render()}
            </div>` : ``) + 
            `<div class="col-8">
                ${await this.input.render()}
            </div>
        </div>`;
    }
}

class FormInput extends FormControl {
    constructor(label, name = undefined, inputtype = 'text', defaultvalue = '') {
        super(label, name);
        this.inputtype = inputtype;
        this.input = new Input(name,inputtype,defaultvalue)
        this.defaultvalue = defaultvalue;
        this.input.populate = this.populate;
    }
}

class FormSelect extends FormControl {
    constructor(label, name, options, def) {
        super(label, name);
        this.options = options;
        this.input = new Select(name, options, def);  
        this.defaultvalue = def;    
        this.input.populate = this.populate;
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
        return `<span id="${this.id}" class='${this.classes}'>${this.text}</span>`;
    }
}

class Header extends Text {
    constructor(text, level) {
        super(text);
        this.level = level;
        return this;
    }
    render() {
        return `<h${this.level} id="${this.id}" class='${this.classes}'>${this.text}</h${this.level}>`;
    }
}

class Modal extends Item {
    constructor(header, display) {
        super();
        this.active = "";
        this.header = header;
        this.display = display;
        this.classes = "row";
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
        return `<div class='${this.classes}'>
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
        return `<div id="${this.id}" class="${this.type} ${this.classes}" type="" name="${this.name}">${this.text}</div>`;
    }
}

// Allows the cration of any tag into the Page/form. Specifically used for items such as Canvas
class HTMLTag extends Item {
    constructor(tagtype, content) {
        super();
        this.tagtype = tagtype;
        this.content = content;
        this.classes = "row";
        return this;
    }
    onClick(func) {
        this.on("click",func);
        return this;
    }
    render() {
        return `<div class='${this.classes}'><div class="col-12"><${this.tagtype} id="${this.id}">${this.content}</${this.tagtype}></div></div>`;
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
            let data = {}
            let passedAllValidations = true;
            for (var i = 0, elem; elem = this.elems[i++];) {
                if (typeof elem.obj.value === "function") {
                    if (typeof elem.obj.validate === "function") {
                        let elementValidation = elem.obj.validate(elem.obj.id, elem.obj.value());
                        passedAllValidations = passedAllValidations && elementValidation;
                    }
                    data[elem.obj.id] = elem.obj.value();
                }
            }
            if (passedAllValidations) {
                this.customSubmit(e, data);
            } else {
                return false;
            }
        }
    }
    _getrender = async () => {
        let html = `<div id="${this.id}" class="${this.classes} ${this.controlGroup}">`;
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
            if (this.customSubmit) {
                buttons += `<button type='submit'>Submit</button>`;
            }
            html += `<div class="row row-btns"><div class="col-12 col-md-12">${buttons}</div></div>`;
        }
        html += "</div>";
        return html;
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