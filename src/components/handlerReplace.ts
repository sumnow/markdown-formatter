export default function onReplace(source: string, target: RegExp, handler: string): string {
    return source.replace(target, function (): string {
        return handler
    })
}