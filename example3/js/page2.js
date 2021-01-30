
class Example3Page extends Form {
    constructor (elem) {
        super (elem);
        this.addHeader("Hello There").refId("Hello").class("blue")
            .addInput("Enter your name").refId("inputName")
            .onSubmit((e, data) => {
                let elem = this.get("Hello");
                elem.class = "green";
                elem.setText("Hello "+data["inputName"])
            })
            .addButton("Click",(e) => { this.events["return"] ? this.events["return"] : null })
    }
}