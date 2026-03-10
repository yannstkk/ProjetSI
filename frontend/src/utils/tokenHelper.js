const TOKEN_KEY = "bat_token"; // BAT = Business Analysis Tool

const tokenHelper = {
    /**
     * Sauvegarde le token JWT dans le localStorage
     * @param {string} token
     */
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    /**
     * Récupere le token JWT depuis le localStorage
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    /**
     * Supprime le token du localStorage (deconnexion)
     */
    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    },

    /**
     * Vérifie si un token est present
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!this.getToken();
    },
};

export default tokenHelper;