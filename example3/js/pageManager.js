class pageManager extends PageController {
    constructor(elem) {
        super(elem);
        console.log(pageManager)
        this.addPage("page1", new(Example2Page)).on("return", () => { 
                console.log("setPage", this); 
                this.setPage("page2") 
            })
            .addPage("page2", new(Example3Page));
    }
}