import { renderLoadingSpinner } from "../components/loading/LoadingSpinner";
import { DEVELOPEMT_SERVER_DOMAIN } from "../config";
import { createButton } from "./buttonUtils";
import { hasSpecialPrivilege } from "../hooks/Authentication";
import { fetchOrders, fetchOrderByOrderNumber, updateOrder } from "../hooks/OrderService";

const searchOrder = async (argument) => {
    if (!argument) {
        return "No argument provided";
    }

    if (argument === 'all') {
        const orders = await fetchOrders();
        return orders.reverse();
    }

    if (/^\d{10}$/.test(argument)) {
        const orders = await fetchOrders();
        const filteredOrders = orders.filter(order => order.phone === argument);
        if (filteredOrders.length > 0) {
            return filteredOrders;
        }
    }

    const order = await fetchOrderByOrderNumber(argument);
    if (order) {
        return order;
    }

    return "Order not found";
};

const getVendorList = async () => {
    const token = sessionStorage.getItem("token");
    const username = sessionStorage.getItem("username");
    const response = await fetch(`${DEVELOPEMT_SERVER_DOMAIN}/vendors`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "X-Username": username
        }
    });
    if (!response.ok) {
        throw new Error("Failed to get vendor list");
    }
    return response.json();
};

const populateDatabase = async () => {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${DEVELOPEMT_SERVER_DOMAIN}/menus/populate`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Failed to populate database");
    }
};

const functionWrapper = async (func, isAsync = false) => {
    const { toggleLoadingSpinner } = renderLoadingSpinner();
    toggleLoadingSpinner(true);
    let result;
    try {
        if (isAsync) {
            result = await func();
        } else {
            result = func();
        }
    } finally {
        setTimeout(() => {
            toggleLoadingSpinner(false);
        }, 5000);
    }
    return result;
};

export async function checkPrivilages() {
    const hasPrivilege = await hasSpecialPrivilege();
    if (hasPrivilege) {
        const header = document.querySelector(".header-nav");
        const specialSection = document.createElement("div");
        specialSection.className = "special-section";

        const buttons = [
            "Populate Database",
            "Vendor List",
            "Create New Account",
            "Search Order",
            "Make Order for Customer",
            "Edit Order"
        ];

        buttons.forEach(buttonText => {
            const button = createButton(buttonText);
            switch (buttonText) {
                case "Populate Database":
                    button.onclick = () => {
                        console.log("populating database");
                        functionWrapper(populateDatabase, true);
                    };
                    break;
                case "Vendor List":
                    button.onclick = () => {
                        console.log("getting vendor list");
                        functionWrapper(getVendorList, true);
                    };
                    break;
                case "Search Order":
                    button.onclick = async () => {
                        let argument = prompt("Enter 'all' to fetch all orders, a 10-digit phone number, or an order number:").trim();
                        if (argument) {
                            console.log(`searching order with argument: ${argument}`);
                            const result = await functionWrapper(() => searchOrder(argument), true);
                            console.log(result);
                        } else {
                            console.log("No valid argument provided");
                        }
                    };
                    break;
                case "Create New Account":
                case "Make Order for Customer":
                case "Edit Order":
                    button.onclick = () => console.log(`${buttonText} button clicked`);
                    break;
                default:
                    break;
            }

            specialSection.appendChild(button);
        });

        header.appendChild(specialSection);
    }
}