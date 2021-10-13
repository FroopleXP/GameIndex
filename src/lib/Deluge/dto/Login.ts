import ErrorResponseDTO from "./Error";

type LoginResponseDTO = {
    id: number,
    result: boolean | null,
    error: ErrorResponseDTO | null
}

export default LoginResponseDTO;