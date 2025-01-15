import { updateOrder } from "../../hooks/OrderService";
import { renderLoadingSpinner } from "../loading/LoadingSpinner";
import "./editorder.css";

export const EditOrder = order => {
    const formData = { ...order, cookId: order.cookId.join(", ") };

    const handleChange = e => {
        const { name, value } = e.target;
        formData[name] = value;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const { toggleLoadingSpinner } = renderLoadingSpinner();
            toggleLoadingSpinner(true);
            await updateOrder(order._id, formData);
            alert("Order updated successfully");
            setTimeout(() => {
                toggleLoadingSpinner(false);
            }, 5000);
            onClose();
        } catch (error) {
            console.error("Failed to update order", error);
            alert("Failed to update order");
        }
    };

    const onClose = () => {
        const dialog = document.querySelector(".editorder-container");
        if (dialog) {
            dialog.remove();
        }
    };

    // Remove existing dialog if it exists
    onClose();

    const form = document.createElement("form");
    form.className = "editorder-form"; // Applied CSS class

    form.addEventListener("submit", handleSubmit);

    const fields = [
        {
            label: "Payment Items Descriptions",
            name: "paymentItemsDescriptions",
            type: "text"
        },
        { label: "Payment Method", name: "paymentMethod", type: "text" },
        { label: "Payment Total", name: "paymentTotal", type: "number" },
        { label: "Phone", name: "phone", type: "text" },
        { label: "Status", name: "status", type: "text" },
        { label: "Street Address", name: "streetAddress", type: "text" },
        { label: "House Number", name: "houseNumber", type: "text" },
        { label: "Time Estimation", name: "timeEstimation", type: "text" },
        { label: "Delivery Charge", name: "deliveryCharge", type: "number" },
        { label: "Chef(s)", name: "cookId", type: "text" }
    ];

    fields.forEach(({ label, name, type }) => {
        const formGroup = document.createElement("div");
        formGroup.className = "editorder-form-group"; // Applied CSS class

        const fieldLabel = document.createElement("label");
        fieldLabel.className = "editorder-form-label"; // Applied CSS class
        fieldLabel.textContent = `${label}:`;

        const input = document.createElement("input");
        input.className = "editorder-form-input"; // Applied CSS class
        input.type = type;
        input.name = name;
        input.value = formData[name];
        input.addEventListener("input", handleChange);

        formGroup.appendChild(fieldLabel);
        formGroup.appendChild(input);
        form.appendChild(formGroup);
    });

    const updateButton = document.createElement("button");
    updateButton.className = "editorder-form-button"; // Applied CSS class
    updateButton.type = "submit";
    updateButton.textContent = "Update Order";
    form.appendChild(updateButton);

    const cancelButton = document.createElement("button");
    cancelButton.className = "editorder-form-button"; // Applied CSS class
    cancelButton.type = "button";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", onClose);
    form.appendChild(cancelButton);

    const dialog = document.createElement("div");
    dialog.className = "editorder-container"; // Applied CSS class
    dialog.appendChild(form);

    document.body.appendChild(dialog);
};
