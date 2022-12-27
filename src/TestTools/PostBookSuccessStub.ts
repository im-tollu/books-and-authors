export function PostBookSuccessStub(bookId: number = 7) {
    return {
        success: true,
        result: {
            bookId,
            message: 'Book Added'
        }
    }
}