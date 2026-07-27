/**
 * Water ripple effect.
 * Original code (Java) by Neil Wallis
 * Ported by Sergey Chikuyonok
 */

(function () {

    var canvas = document.getElementById("waterCanvas"),
        ctx = canvas.getContext("2d"),
        width = window.innerWidth,
        height = window.innerHeight,
        half_width = width >> 1,
        half_height = height >> 1,
        size = width * (height + 2) * 2,
        delay = 30,
        oldind = width,
        newind = width * (height + 3),
        riprad = 12,
        ripplemap = [],
        last_map = [],
        ripple,
        texture;

    canvas.width = width;
    canvas.height = height;

    // Load background image
 const img = new Image();
img.src = "./images/empty-flowers.jpg";

img.onload = function () {

    // Create repeating pattern
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = 600;
    patternCanvas.height = 900;

    const patternCtx = patternCanvas.getContext("2d");

    // Draw one tile
    patternCtx.drawImage(img, 0, 0, 600, 900);

    // Fill entire canvas with repeated tiles
    const pattern = ctx.createPattern(patternCanvas, "repeat");

    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, width, height);

    // Save image data for ripple effect
    texture = ctx.getImageData(0, 0, width, height);
    ripple = ctx.getImageData(0, 0, width, height);

    // Initialize ripple arrays
    for (let i = 0; i < size; i++) {
        ripplemap[i] = 0;
        last_map[i] = 0;
    }

    setInterval(run, delay);
};
    function run() {
        newframe();
        ctx.putImageData(ripple, 0, 0);
    }

function disturb(dx, dy) {

    dx <<= 0;
    dy <<= 0;

    const radiusX = 20;
    const radiusY = 3;
    const angle = 3 * Math.PI / 180;

    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    for (let y = -radiusX; y <= radiusX; y++) {
        for (let x = -radiusX; x <= radiusX; x++) {

            const xr = x * cos - y * sin;
            const yr = x * sin + y * cos;

            if (
                (xr * xr) / (radiusX * radiusX) +
                (yr * yr) / (radiusY * radiusY) <= 1
            ) {

                const px = dx + x;
                const py = dy + y;

                if (
                    px >= 0 && px < width &&
                    py >= 0 && py < height
                ) {
                    ripplemap[oldind + py * width + px] += 128;
                }
            }
        }
    }

}

    function newframe() {

        var a, b, data, cur_pixel, new_pixel, old_data;

        var t = oldind;
        oldind = newind;
        newind = t;

        var i = 0;

        var _width = width,
            _height = height,
            _ripplemap = ripplemap,
            _last_map = last_map,
            _rd = ripple.data,
            _td = texture.data,
            _half_width = half_width,
            _half_height = half_height;

        for (var y = 0; y < _height; y++) {

            for (var x = 0; x < _width; x++) {

                var _newind = newind + i,
                    _mapind = oldind + i;

                data =
                    (
                        _ripplemap[_mapind - _width] +
                        _ripplemap[_mapind + _width] +
                        _ripplemap[_mapind - 1] +
                        _ripplemap[_mapind + 1]
                    ) >> 1;

                data -= _ripplemap[_newind];
                data -= data >> 5;

                _ripplemap[_newind] = data;

                data = 1024 - data;

                old_data = _last_map[i];
                _last_map[i] = data;

                if (old_data != data) {

                    a = (((x - _half_width) * data / 1024) << 0) + _half_width;
                    b = (((y - _half_height) * data / 1024) << 0) + _half_height;

                    if (a >= _width) a = _width - 1;
                    if (a < 0) a = 0;
                    if (b >= _height) b = _height - 1;
                    if (b < 0) b = 0;

                    new_pixel = (a + (b * _width)) * 4;
                    cur_pixel = i * 4;

                    _rd[cur_pixel] = _td[new_pixel];
                    _rd[cur_pixel + 1] = _td[new_pixel + 1];
                    _rd[cur_pixel + 2] = _td[new_pixel + 2];
                    _rd[cur_pixel + 3] = 255;
                }

                ++i;
            }

        }

    }

    canvas.addEventListener("mousemove", function (evt) {

        const rect = canvas.getBoundingClientRect();

        disturb(
            evt.clientX - rect.left,
            evt.clientY - rect.top
        );

    });

    // Random raindrops
    setInterval(function () {

        disturb(
            Math.random() * width,
            Math.random() * height
        );

    }, 50);

    // Handle resizing
    window.addEventListener("resize", function () {
        location.reload();
    });

})();