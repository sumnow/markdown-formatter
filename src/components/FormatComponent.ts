
export class FormatComponent {
    public text: string;
    protected name: string;
    public constructor(text: string) {
        this.text = text;
    }
    public outputBeforeInfo() {
        console.log(`< before format ${this.name} >`)
        console.log(`${this.text}`)
    }
    public outputAfterInfo() {
        console.log(`< after format ${this.name} >`)
        console.log(`${this.text}`)
    }
}