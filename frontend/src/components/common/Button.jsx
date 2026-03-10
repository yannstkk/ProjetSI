export default function Button({ children, onClick, disabled, type = "button" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-950 disabled:bg-blue-300 transition"
        >
            {children}
        </button>
    );
}