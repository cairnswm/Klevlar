
class Example3Page extends Form {
    constructor (elem) {
        super (elem);
        this.addHeader("Page Two")
            .addHeader("Hello").refId("Hello").class("blue")
            .addElem(new FormInput("Name","inputName")).refId("inputName")
            .onSubmit((e, data) => {
                let elem = this.get("Hello");
                elem.class = "green";
                elem.setText("Hello "+data["inputName"])
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