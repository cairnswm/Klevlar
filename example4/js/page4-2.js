
class Example3Page extends Form {
    constructor (elem) {
        super (elem);
        this.addHeader("Page Two")
            .addHeader("Hello").refId("Hello").class("blue")
            .addElem(new FormInput("Name","inputName")).refId("inputName")
            .addCheckbox("inputCheck","hello").refId("inputCheckbox")
            .addElem(new FormCheckbox("Check","check")).refId("inputCheck").internal("checked",true)
            .onSubmit((e, data) => {
                let elem = this.get("Hello");
                elem.class = "green";
                console.log("inputCheck",data)
                elem.setText("Hello "+data["inputName"] + (data["inputCheck"] ? " and is checked" : ""))
            })
            .addButton("Switch Page",(e) => { 
                console.log("Page click", this.event); 
                if (this.event["return"]) {
                    console.log("Calling");
                    this.event["return"]();
                 } else {
                     console.log("no event");
                 } 
            })
    }
}