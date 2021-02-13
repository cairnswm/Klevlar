class pageManager extends PageController {
    constructor(elem) {
        super(elem);
        this.addPage("page1", new(Example2Page)).on("return", () => { 
                this.setPage("page2") 
            })
            .addPage("page2", new(Example3Page)).on("return", () => { 
                this.setPage("page1") 
            });
    }
}