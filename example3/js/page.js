
class Example2Page extends Form {
    constructor (elem) {
        super (elem);
        this.addHeader("Hello").refId("Hello")
            .addElem(new FormInput("Name","inputName")).refId("inputName").populate(() => { return "Will"; })
            .addElem(new FormSelect("Age","SelectAge",[10,20,30,40,50],20)).refId("SelectAge")
            .onSubmit((e, data) => {
                let elem = this.get("Hello");
                elem.class = ("red");
                elem.setText("Hello "+data["inputName"])
            })
            .addButton("Click",(e) => { 
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