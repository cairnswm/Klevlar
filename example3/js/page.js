
class Example2Page extends Form {
    constructor (elem) {
        super (elem);
        this.addHeader("Hello").refId("Hello")
            .addInput("Enter your name").refId("inputName")
            .onSubmit((e, data) => {
                let elem = this.get("Hello");
                elem.class = "red";
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