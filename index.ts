import { create } from "./src/cmd/create";

async function main() {
  const command = process.argv[2];

  switch (command) {
    case "create":
      await create();
      break;
    default:
      console.log("Command not found.");
      break;
  }
}

main()
  .then(() => {
    console.log("Done!");
  })
  .catch((err) => {
    console.error(err);
  });
