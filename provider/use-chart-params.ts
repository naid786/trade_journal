import { create } from "zustand";
import { ChartParams } from "@/types";
import { persist, createJSONStorage } from "zustand/middleware";

interface ChartParamStore {
    items: ChartParams[];
    addItem: (item: ChartParams) => void;
    removeItem: (id: string) => void;
    removeAll: () => void;
};

const useChartParams = create(
    persist<ChartParamStore>((set, get) => ({

        items: [],
        addItem: (data: ChartParams) => {
            const currentItems = get().items;
            const existingItem = currentItems.find(item => item.id === data.id);

            if (existingItem) {
                return "item already in cart.";
            }

            set({ items: [...get().items, data] });
            return "Item added to cart";
        },

        removeItem: (id: string) => {
            set({ items: get().items.filter((item) => item.id !== id) });
            return "Item removed from cart";
        },

        removeAll: () => {
            set({ items: [] });
        },

    }), {
        name: "cart-storage",
        storage: createJSONStorage(() => localStorage)
    })

);


export default useChartParams;