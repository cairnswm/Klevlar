
class Example1Page extends Page {
    constructor (elem, name) {
        super (elem);
        this.addHeader("Hello World")
            .addText("Hello World from ")
            .addText("Klevlar");
    }
}