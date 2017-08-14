var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    /** @desription A way organize objects implementeing {@link CosmicArkAdvanced.IPhysicsReady} IPhysicsReady.
    * @type {enum}
    * @returns {number}
    * @see {CosmicArkAdvanced.IPhysicsReady} */
    var PhysicsTag;
    (function (PhysicsTag) {
        PhysicsTag[PhysicsTag["PLAYER"] = 0] = "PLAYER";
        PhysicsTag[PhysicsTag["ALIEN"] = 1] = "ALIEN";
        PhysicsTag[PhysicsTag["MINE"] = 2] = "MINE";
    })(PhysicsTag = CosmicArkAdvanced.PhysicsTag || (CosmicArkAdvanced.PhysicsTag = {}));
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=PhysicsTag.js.map