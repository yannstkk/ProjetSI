export default function Input({ label, type, value, onChange, placeholder, error, isValid }) {

    return (
        <div>

            <label className="block text-sm font-medium mb-2">
                {label}
            </label>

            {error && (
                <p className="text-red-500 text-sm mb-2">
                    {error}
                </p>
            )}

            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full border rounded-lg px-4 py-3 outline-none
        ${error ? "border-red-500" : isValid ? "border-green-500" : "border-gray-300"}`}
            />

        </div>
    );

}