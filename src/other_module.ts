export function someFunction(): void {
  const body = document.getElementsByTagName('body')[0];
  body.style.backgroundColor = 'lightblue';
}

function a(target: any) {
  return target;
}

@a
export class Foo {}
