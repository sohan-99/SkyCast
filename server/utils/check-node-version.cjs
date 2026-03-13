const [major] = process.versions.node.split(".").map(Number);

if (major < 20) {
  console.error(
    `Unsupported Node.js runtime: v${process.versions.node}. Use Node.js 20+ to run this project.`
  );
  process.exit(1);
}

if (major >= 25) {
  console.warn(
    `Warning: Node.js v${process.versions.node} is non-LTS for this stack. If MongoDB TLS errors occur, use Node 22 LTS.`
  );
}
