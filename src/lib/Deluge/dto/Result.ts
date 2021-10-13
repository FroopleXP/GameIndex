import ErrorResponseDTO from "./Error";

type Result<T> = {
    id: number,
    result: T | null,
    error: ErrorResponseDTO | null
}

export default Result;