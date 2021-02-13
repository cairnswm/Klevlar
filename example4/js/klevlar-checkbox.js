class Checkbox extends Item {
    constructor(name = undefined, defaultvalue = 'default') {
        super();
        if (!name) {
            name = this.id;
        }
        this.name = name;
        this.checked = false;
        this.defaultvalue = defaultvalue;
        this.validate = (name, value) => { 
            return true; 
        }
        this.classes = "row";
        return this;
    }
    value = () => {
        return document.getElementById(`${this.id}.value`).checked;
    }
    render() {
        let req = this.required ? "required" : "";
        let def = this.defaultvalue;
        let checked = this.checked || (this.populate ? this.populate() : false) ? "checked" : "";
        let ro = this.readonly ? "readonly" : "";
        return `<input type="checkbox" name="${this.name}" id="${this.id}.value" value="${def}" ${req} ${ro} ${checked}/>`;
    }
}

Container.prototype.addCheckbox = function(name = undefined, defaultvalue = 'default') {
    let checkbox = new Checkbox(name, defaultvalue);
    this.addElem({type:"checkbox", obj: checkbox});
    this.last = checkbox;
    return this;
}

class FormCheckbox extends FormControl {
    constructor(label, name = undefined, defaultvalue = 'default') {
        super(label, name);
        this.inputtype = "checkbox";
        this.defaultvalue = defaultvalue;
        this.input = new Checkbox(name,defaultvalue)
        this.value = () => { return this.input.value() };
        this.input.populate = this.populate;
    }
    set checked(value = true) {
        this.ischecked = value;
    }
    populate = () => {
        return this.ischecked ? this.ischecked : false;
    }
}