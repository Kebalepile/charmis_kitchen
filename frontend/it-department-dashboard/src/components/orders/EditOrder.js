/**
 * Component for editing an order.
 * 
 * @param {Object} order - The order object to be edited.
 * @param {string} order._id - The unique identifier of the order.
 * @param {string} order.paymentItemsDescriptions - Descriptions of payment items.
 * @param {string} order.paymentMethod - The payment method used.
 * @param {number} order.paymentTotal - The total payment amount.
 * @param {string} order.phone - The phone number associated with the order.
 * @param {string} order.status - The current status of the order.
 * @param {string} order.streetAddress - The street address for delivery.
 * @param {string} order.houseNumber - The house number for delivery.
 * @param {string} order.timeEstimation - The estimated time for delivery.
 * @param {number} order.deliveryCharge - The delivery charge amount.
 * @param {Array<string>} order.cookId - The IDs of the cooks assigned to the order.
 * 
 * @returns {void}
 */

import { updateOrder } from "../../hooks/OrderService";
import { renderLoadingSpinner } from "../loading/LoadingSpinner";
// import { DEVELOPMENT_SERVER_DOMAIN } from "../config";
import "./editorder.css";


export const EditOrder = (order) => {
    const formData = { ...order, cookId: order.cookId.join(", ") };

    const handleChange = (e) => {
        const { name, value } = e.target;
        formData[name] = value;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Assuming renderLoadingSpinner and updateOrder are defined elsewhere
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
        document.querySelector(".edit-order-dialog").remove();
    };

    const form = document.createElement("form");
    form.addEventListener("submit", handleSubmit);

    const fields = [
        { label: "Payment Items Descriptions", name: "paymentItemsDescriptions", type: "text" },
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
        const fieldLabel = document.createElement("label");
        fieldLabel.textContent = `${label}:`;
        const input = document.createElement("input");
        input.type = type;
        input.name = name;
        input.value = formData[name];
        input.addEventListener("input", handleChange);
        fieldLabel.appendChild(input);
        form.appendChild(fieldLabel);
    });

    const updateButton = document.createElement("button");
    updateButton.type = "submit";
    updateButton.textContent = "Update Order";
    form.appendChild(updateButton);

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", onClose);
    form.appendChild(cancelButton);

    const dialog = document.createElement("div");
    dialog.className = "edit-order-dialog";
    dialog.appendChild(form);

    document.body.appendChild(dialog);
};
