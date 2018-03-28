import { execFile } from "../../../utility";

export async function initializeElmPackage(projectDirectory: string) {
  const args = ["install", "--yes"];
  await execFile("elm-package", args, { cwd: projectDirectory });
}

export async function installElmPackage(
  projectDirectory: string,
  packageName: string,
  packageVersion: string,
) {
  const args = ["install", "--yes", packageName];
  if (packageVersion !== "latest") {
    const semver = `${packageVersion}${".0".repeat(
      2 - (packageVersion.match(/\./g) || []).length,
    )}`;
    args.push(semver);
  }
  await execFile("elm-package", args, { cwd: projectDirectory });
  // TODO: return meaningful error when elm-package is not installed
  // see https://github.com/jwoLondon/litvis/issues/27
}

export async function runElm(
  projectDirectory: string,
  modulePath: string,
  outputSymbolName: string,
) {
  return await execFile(
    "run-elm",
    [
      "--report=json",
      "--output-name",
      outputSymbolName,
      "--project-dir",
      projectDirectory,
      modulePath,
    ],
    { bufferSize: 1024 * 1024 * 100 }, // avoid stdout truncation
  );
  // TODO: return meaningful error when elm-run is not installed
}
