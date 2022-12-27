export function GetSuccessfulUserLoginStub() {
    return {
        success: true,
        result: {
            email: 'a@b.com',
            token: '1234a@b.com',
            message: 'Success: found user.'
        }
    }
}