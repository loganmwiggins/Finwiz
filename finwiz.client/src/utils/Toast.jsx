import { toast } from "react-toastify";

export const showToast = (message, type = "info", label = "") => {
    toast[type](
        <div>
            {label && <strong>{label}</strong>}
            <p>{message}</p>
        </div>
    );
};