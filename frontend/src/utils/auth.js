export const saveAuth = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem(
        "user",
        JSON.stringify({
            fullName: data.fullName,
            email: data.email,
            role: data.role,
        })
    );
};

export const getToken = () => localStorage.getItem("token");

export const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const isAuthenticated = () => !!getToken();
