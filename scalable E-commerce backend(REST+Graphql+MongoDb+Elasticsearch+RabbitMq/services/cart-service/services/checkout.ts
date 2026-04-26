import { buildServiceUrl } from "../../../packages/common/src";
import { cartConfig, cartEventBus, cartStore } from "./cartStore";

export const checkoutCart = async (userId: string): Promise<{ total: number; currency: string }> => {
	const cart = await cartStore.getCart(userId);

	if (cart.items.length === 0) {
		throw new Error("Cart is empty");
	}

	await cartEventBus.publish("cart.checkout.requested", {
		userId,
		cart,
		paymentCallbackUrl: buildServiceUrl(cartConfig, "payments", "/payments/process")
	});
	await cartStore.clear(userId);

	return {
		total: cart.subtotal,
		currency: cart.currency
	};
};