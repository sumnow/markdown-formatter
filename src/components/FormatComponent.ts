
export abstract class FormatComponent {
    public text: string;
    protected name: string;
    public constructor(text: string) {
        this.text = text;
    }
}