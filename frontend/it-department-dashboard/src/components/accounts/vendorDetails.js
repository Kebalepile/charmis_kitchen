import "./vendorDetails.css";
let editIndex = null;
let isAvailable = null;

const handleCheckboxChange = (index, vendors) => {
    editIndex = index;
    isAvailable = !vendors[index].isAvailable;
    renderVendors(vendors);
};

const handleSave = vendors => {
    vendors[editIndex].isAvailable = isAvailable;
    console.log("Updated vendor:", vendors[editIndex]);
    editIndex = null;
    isAvailable = null;
    renderVendors(vendors);
};

const handleCancel = vendors => {
    editIndex = null;
    isAvailable = null;
    renderVendors(vendors);
};

const renderVendors = vendors => {
    const vendorDetails = document.querySelector(".vendor-details");
    vendorDetails.innerHTML = "";

    const toggleButton = document.createElement("button");
    toggleButton.textContent = "x";
    toggleButton.className="vendor-toggle";
    toggleButton.addEventListener("click", () => {
        const vendorDetails = document.querySelector(".vendor-details");
        if (vendorDetails) {
            vendorDetails.remove();
        } else {
            vendorDetailsContainer(vendors);
        }
    });
    vendorDetails.appendChild(toggleButton);

    vendors.forEach((vendor, index) => {
        const vendorItem = document.createElement("div");
        vendorItem.className = "vendor-item";

        const name = document.createElement("p");
        name.textContent = `Name: ${vendor.name}`;
        vendorItem.appendChild(name);

        const address = document.createElement("p");
        address.textContent = `Address: ${vendor.address}`;
        vendorItem.appendChild(address);

        const phone = document.createElement("p");
        phone.textContent = `Phone: ${vendor.phone}`;
        vendorItem.appendChild(phone);

        const label = document.createElement("label");
        label.textContent = "Is Available: ";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = editIndex === index ? isAvailable : vendor.isAvailable;
        checkbox.addEventListener("change", () =>
            handleCheckboxChange(index, vendors)
        );
        label.appendChild(checkbox);
        vendorItem.appendChild(label);

        if (editIndex === index) {
            const editButtons = document.createElement("div");
            editButtons.className = "edit-buttons";

            const saveButton = document.createElement("button");
            saveButton.textContent = "Save";
            saveButton.addEventListener("click", () => handleSave(vendors));
            editButtons.appendChild(saveButton);

            const cancelButton = document.createElement("button");
            cancelButton.textContent = "Cancel";
            cancelButton.addEventListener("click", () => handleCancel(vendors));
            editButtons.appendChild(cancelButton);

            vendorItem.appendChild(editButtons);
        }

        vendorDetails.appendChild(vendorItem);
    });
};

export const vendorDetailsContainer = vendors => {
    let vendorDetails = document.querySelector(".vendor-details");
    if (!vendorDetails) {
        vendorDetails = document.createElement("div");
        vendorDetails.className = "vendor-details component";
        document.body.appendChild(vendorDetails);
    }
    renderVendors(vendors);
};
