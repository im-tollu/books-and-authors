export function SingleBookResultStub(bookName: string, bookId: number) {
    return {
        success: true,
        result: [
            {
                bookId,
                name: bookName,
                emailOwnerId: 'a@b.com',
                devOwnerId: 'im.tollu@gmail.com'
            }
        ]
    }
}