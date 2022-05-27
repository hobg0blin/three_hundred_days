import { Object3D, Mesh, CylinderGeometry, CircleGeometry, MeshPhongMaterial, DoubleSide} from 'three'
import {getRandomInt} from '../utils/RandomInt.js'
// from https://github.com/lmparppei/deadtree/blob/master/deadtree.js
/*
DEADTREE 1.1
A dead simple randomly generated tree for Three.js.
Some parameters (such as shrink modifier) are hard-coded but you can
tweak them yourself.
Example:
var material = new THREE.MeshPhongMaterial({ color: 0x555555 });
var tree = deadTree(5, material, 5);
scene.add(tree);
*/

let leafColors = ['red', 'yellow', 'orange', 'salmon', 'violet']
function proceduralTree (size, material, children, leaves = false) {
    var sizeModifier = .65;
    var branchPivots = [];

    var tree = createBranch(size, material, children, false, sizeModifier)
    tree.branchPivots = branchPivots;
    return tree;

    // Recursive branch function
    function createBranch (size, material, children, isChild, sizeModifier) {
        var branchPivot = new Object3D();
        var branchEnd = new Object3D();
        branchPivots.push(branchPivot);

        var length = Math.random() * (size * 10) + size * 5;

        if (children == 0) { var endSize = 0; } else { var endSize = size * sizeModifier; }

        var branch = new Mesh(new CylinderGeometry(endSize, size, length, 5, 1, true), material);

        branchPivot.add(branch);
        branch.add(branchEnd);

        branch.position.y = length / 2;
        branchEnd.position.y = length / 2 - size * .4;
        branch.castShadow = true;
        branch.receiveShadow = true;

        if (isChild) {
            branchPivot.rotation.z += Math.random() * 1.5 - sizeModifier * 1.05;
            branchPivot.rotation.x += Math.random() * 1.5 - sizeModifier * 1.05;
        } else {

            branchPivot.rotation.z += Math.random() * .1 - .05;
            branchPivot.rotation.x += Math.random() * .1 - .05;
        }

        if (children > 0) {
            for (var c=0; c<children; c++) {
                var child = createBranch(size * sizeModifier, material, children - 1, true, sizeModifier);
                branchEnd.add(child);
            }
        } else {
            let leaf = new Mesh(new CircleGeometry(0.4, getRandomInt(3, 10)), new MeshPhongMaterial({color: leafColors[getRandomInt(0, leafColors.length -1)], side: DoubleSide}))
            leaf.scale.set(1 + Math.random() * 3, 2.5 + Math.random() * 3, 1 + Math.random() * 3)
            branchEnd.add(leaf)
        }

        return branchPivot;
    }
}

export { proceduralTree }
