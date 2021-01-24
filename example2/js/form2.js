
class Example1Page extends Form {
    constructor (elem) {
        super (elem);
        this.addHeader("Hello").refId("Hello")
            .addInput("Enter your name").refId("inputName")
            .onSubmit((e, data) => {
                console.log("DATA", data);
                let elem = this.get("Hello");
                console.log(elem);
                elem.setText("Hello "+data["inputName"])
            })
    }
}