precision mediump float;

uniform sampler2D targetMap;

varying vec2 vUv;

struct optionsStruct {
	float hue;
	bool magnify;
};

uniform optionsStruct options;

vec3 hueShift(vec3 color, float hue) {
	const vec3 k = vec3(0.57735, 0.57735, 0.57735);
	float cosAngle = cos(hue);
	return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
}

struct bubbleStruct {
	float radius;
	float glareOffset;
	float glareAngleStart;
	float glareAngleEnd;
	vec2 position;
};

struct magnificationStruct {
	bubbleStruct bubbles[3];
	vec2 resolution;
};

uniform magnificationStruct magnification;

float getOffset(vec2 point, vec2 circle) {
	return sqrt(pow(point.x - circle.x, 2.0) + pow(point.y - circle.y, 2.0));
}

bool isBetweenAngles(vec2 point, float glareAngleStart, float glareAngleEnd) {
	float angle = atan(point.y, point.x);
	return angle >= glareAngleStart && angle <= glareAngleEnd;
}

bool isCurrentBubble(vec2 point, vec2 circle, float radius, float outlineThickness) {
	float offset = getOffset(point, circle);
	return offset < radius + outlineThickness;
}

bool isInsideCircle(vec2 point, vec2 circle, float radius) {
	float offset = getOffset(point, circle);
	return offset < radius;
}

bool isOutlineCircle(vec2 point, vec2 circle, float radius, float outlineThickness) {
	float offset = getOffset(point, circle);
	return floor(offset) >= floor(radius) && floor(offset) <= floor(radius + outlineThickness);
}

bool isGlare(vec2 point, vec2 circle, float radius, float glareThickness, float glareAngleStart, float glareAngleEnd) {
	bool isBetweenGlareAngles = isBetweenAngles(point - circle, glareAngleStart, glareAngleEnd);
	bool isWithinGlareOutline = isOutlineCircle(point, circle, radius, glareThickness);
	return isBetweenGlareAngles && isWithinGlareOutline;
}

vec4 blendOutline(vec4 texture, vec4 outline) {
	return vec4(mix(texture.rgb, outline.rgb, outline.a), texture.a);
}

vec4 magnify(sampler2D targetMap, magnificationStruct magnification) {
	float outlineThickness = 1.5;
	vec4 outlineColor = vec4(1, 1, 1, 0.15);

	float glareThickness = outlineThickness;
	vec4 glareColor = outlineColor;

	vec2 resolution = magnification.resolution;
	bubbleStruct bubble = magnification.bubbles[0];
	vec2 point = gl_FragCoord.xy;

	for (int index = 0; index < 3; index++) {
		bubbleStruct currentBubble = magnification.bubbles[index];

		vec2 currentPosition = currentBubble.position;
		float currentRadius = currentBubble.radius;

		if (isCurrentBubble(point, currentPosition, currentRadius, outlineThickness)) {
			bubble = currentBubble;
		}
	}

	vec2 position = bubble.position;
	float radius = bubble.radius;
	float glareAngleStart = bubble.glareAngleStart;
	float glareAngleEnd = bubble.glareAngleEnd;
	float glareOffset = bubble.glareOffset;

	float h = bubble.radius / 2.0;

	float hr = radius * sqrt(1.0 - pow((radius - h) / radius, 2.0));
	float offset = sqrt(pow(point.x - position.x, 2.0) + pow(point.y - position.y, 2.0));

	bool pointIsInside = isInsideCircle(point, position, hr);
	bool pointIsOutline = isOutlineCircle(point, position, hr, outlineThickness);
	bool pointIsGlare = isGlare(point, position, hr * glareOffset, glareThickness, glareAngleStart, glareAngleEnd);

	vec2 newPoint = pointIsInside ? (point - position) * (radius - h) / sqrt(pow(radius, 2.0) - pow(offset, 2.0)) + position : point;

	vec2 newVUv = (newPoint) / resolution;

	if (pointIsOutline || pointIsGlare) {
		return blendOutline(texture2D(targetMap, newVUv), outlineColor);
	}

	return texture2D(targetMap, newVUv);
}

void main() {

	vec4 texel = texture2D( targetMap, vUv );

	if (options.magnify) {
		texel = magnify(targetMap, magnification);
	}

	if (options.hue != 0.0) {
		vec3 hueShifted = hueShift(texel.rgb, options.hue);
		gl_FragColor = vec4(hueShifted.rgb, 1);
	} else {
		gl_FragColor = texel;
	}

}