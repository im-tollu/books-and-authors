export function GetSuccessfulRegistrationStub() {
    return {
        success: true,
        result: {
            email: 'a@b.com',
            token: '1234a@b.com',
            message: 'Success: Limited to one test account per trainee!'
        }
    }
}