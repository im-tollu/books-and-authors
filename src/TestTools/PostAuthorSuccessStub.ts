export function PostAuthorSuccessStub(authorId: number = 7) {
    return {
        success: true,
        result: {
            message: "Author Created",
            authorId
        }
    }
}