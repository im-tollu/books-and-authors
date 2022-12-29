export function GetSuccessAuthorsStub() {
    return {
        success: true,
        result: [
            {
                authorId: 1,
                name: 'Isaac Asimov',
                bookIds: [1, 2],
            },
            {
                authorId: 2,
                name: 'Kenneth Graeme',
                bookIds: [3],
            }
        ]
    }
}