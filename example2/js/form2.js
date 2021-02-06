
class Example2Page extends Form {
    constructor (elem) {
        super (elem);
        this.addHeader("Hello").refId("Hello")
            .addElem(new Label("Enter your name","inputName"))
            .addInput("inputName").refId("inputName")
            .addElem(new FormInput("Age","inputAge")).refId("inputAge")
            .onSubmit((e, data) => {
                let elem = this.get("Hello");
                elem.class = "red";
                elem.setText("Hello "+data["inputName"]+" you are "+data["inputAge"]+" years old")
            })
    }
}