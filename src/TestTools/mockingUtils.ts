export function mockResolve(mock: any, resolvedValue: any): jest.Mock {
    return (mock as jest.Mock).mockResolvedValue(resolvedValue)
}