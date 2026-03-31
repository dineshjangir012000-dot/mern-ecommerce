export const API_BASE_URL = "http://localhost:3000";

export const getImageUrl = (path? : String) => {
    if(!path){
        return "https://via.placeholder.com/300x300?text=No+Image";
    }
    return `${API_BASE_URL}/${path}`;
};