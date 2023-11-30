import { createRelayers } from "./src/cmd/create-relayers";
import { deployContract } from "./src/cmd/deploy-contract";

async function main() {
	const command = process.argv[2];
	
	switch (command) {
		case 'create-relayers':
			await createRelayers();
			break;
		case 'deploy-contract':
			await deployContract();
			break;
		default:
			console.log("Command not found.");
			break;
	}
}

main().then(() => {
	console.log("Done!");
}).catch((err) => {
	console.error(err);
});