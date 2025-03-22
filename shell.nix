{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.python311
    pkgs.python311Packages.pip
  ];

  shellHook = ''
    pip install --user -r requirements.txt
  '';
}
