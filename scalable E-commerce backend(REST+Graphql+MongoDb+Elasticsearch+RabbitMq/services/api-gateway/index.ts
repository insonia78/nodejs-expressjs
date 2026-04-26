import { getServiceConfig } from "../../packages/common/src";

import app from "./app";

const gatewayConfig = getServiceConfig("gateway", 4000);

app.listen(gatewayConfig.port, () => {
	console.info(`[gateway] listening on port ${gatewayConfig.port}`);
});