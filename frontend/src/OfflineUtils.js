export const isOnlineBooks = async () => {
    try {
        if(!navigator.onLine)
        {
            alert("Network error. The internet is down.")
            return false;
        }
        const response = await fetch("http://localhost:3001/api/books");
        return response.ok;
    } catch (error) {
        alert("Network error. The backend is down.")
        return false;
    }
};

export const isOnlineReviews = async () => {
    try {
        if(!navigator.onLine)
        {
            alert("Network error. The internet is down.")
            return false;
        }
        const response = await fetch("http://localhost:3001/api/reviews");
        return response.ok;
    } catch (error) {
        alert("Network error. The backend is down.")
        return false;
    }
};

export const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

const validateBookId = async (bookId) => {
    try {
        const response = await fetch(`http://localhost:3001/api/books/${bookId}`);
        return response.ok;
    } catch (error) {
        console.error("Error validating book ID:", error);
        return false;
    }
};

export const syncWithDataServerForAddBook = async () => {
    try {
        const unsyncedData = getFromLocalStorage("unsyncedData");
        if (unsyncedData) {
            const response = await fetch("http://localhost:3001/api/books", {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(unsyncedData),
            });
            if (response.ok) {
                localStorage.removeItem("unsyncedData");
                alert("Data successfully synced with server");
            } else {
                console.error("Failed to sync data with server");
            }
        }
    } catch (error) {
        console.error("Error syncing data with server:", error);
    }
};

export const syncWithDataServerForUpdateBook = async () => {
    try {
        const unsyncedData = getFromLocalStorage("unsyncedData");
        if (unsyncedData) {
            const response = await fetch(`http://localhost:3001/api/books/${unsyncedData.id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(unsyncedData),
            });
            if (response.ok) {
                localStorage.removeItem("unsyncedData");
                alert("Data successfully synced with server");
            } else {
                console.error("Failed to sync data with server");
            }
        }
    } catch (error) {
        console.error("Error syncing data with server:", error);
    }
};

export const syncWithDataServerForAddReview = async () => {
    try {
        const unsyncedData = getFromLocalStorage("unsyncedData");
        if (unsyncedData) {
            const isBookIdValid = await validateBookId(unsyncedData.bookid);
            if (!isBookIdValid) {
                alert("Invalid book ID specified for the review. Review will not be synced.");
                return;
            }
            const response = await fetch("http://localhost:3001/api/reviews", {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(unsyncedData),
            });
            if (response.ok) {
                localStorage.removeItem("unsyncedData");
                alert("Data successfully synced with server");
            } else {
                console.error("Failed to sync data with server");
            }
        }
    } catch (error) {
        console.error("Error syncing data with server:", error);
    }
};

export const syncWithDataServerForUpdateReview = async () => {
    try {
        const unsyncedData = getFromLocalStorage("unsyncedData");
        if (unsyncedData) {
            const response = await fetch(`http://localhost:3001/api/reviews/${unsyncedData.id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(unsyncedData),
            });
            if (response.ok) {
                localStorage.removeItem("unsyncedData");
                alert("Data successfully synced with server");
            } else {
                console.error("Failed to sync data with server");
            }
        }
    } catch (error) {
        console.error("Error syncing data with server:", error);
    }
};
  
export const handleOfflineSubmit = async (formData) => {
    try {
        saveToLocalStorage("unsyncedData", formData);
        alert("Data saved for later sync");
    } catch (error) {
        console.error("Error saving data for later sync:", error);
    }
};

window.addEventListener("online", () => {
    syncWithDataServerForAddBook();
    syncWithDataServerForUpdateBook();
    syncWithDataServerForAddReview();
    syncWithDataServerForUpdateReview();
});