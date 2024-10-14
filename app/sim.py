import doctest
import json
from functools import reduce
from operator import __or__
import numpy as np
from random import random

# MODELING & SIMULATION

init0 = {
    'Planet-1': {
        'time': 0, 'timeStep': 0.02, 'mass': 1E6,
        'x': 0, 'y': 50, 'vx': 40, 'vy': 0,
        'variant': False
    },
    'Planet-2': {
        'time': 0, 'timeStep': 0.02, 'mass': 2E6,
        'x': 0, 'y': -50, 'vx': -40, 'vy': 0,
        'variant': False
    },
    'Satellite': {
        'time': 0, 'timeStep': 0.02, 'mass': 1E5,
        'x': 0, 'y': -200, 'vx': 90, 'vy': 0,
        'variant': False
    }
}

init1 = {
    'Planet-1': {
        'time': 0, 'timeStep': 0.02, 'mass': 1E6,
        'x': 0, 'y': 50, 'vx': 40, 'vy': 0,
        'variant': False
    },
    'Planet-2': {
        'time': 0, 'timeStep': 0.02, 'mass': 2E6,
        'x': 0, 'y': -50, 'vx': -40, 'vy': 0,
        'variant': False
    },
    'Satellite': {
        'time': 0, 'timeStep': 0.02, 'mass': 1E5,
        'x': 0, 'y': -200, 'vx': 89.9999, 'vy': 0,
        'variant': False
    }
}

init2 = {
    'Planet-1': {
        'time': 0, 'timeStep': 0.02, 'mass': 1E6,
        'x': 0, 'y': 50, 'vx': 40, 'vy': 0,
        'variant': False
    },
    'Planet-2': {
        'time': 0, 'timeStep': 0.02, 'mass': 2E6,
        'x': 0, 'y': -50, 'vx': -40, 'vy': 0,
        'variant': False
    },
    'Satellite': {
        'time': 0, 'timeStep': 0.02, 'mass': 1E5,
        'x': 0, 'y': -200, 'vx': 90.0001, 'vy': 0,
        'variant': False
    }
}

inits = [init0, init1, init2]

def getAgentState(agentId, universe):
    """Collect position and velocity for a specified agent."""
    state = universe[agentId]
    time, timeStep, mass, x, y, vx, vy = (
        state['time'], state['timeStep'], state['mass'],
        state['x'], state['y'],
        state['vx'], state['vy']
    )
    position = np.asarray([x, y], float)
    velocity = np.asarray([vx, vy], float)
    return time, timeStep, mass, position, velocity

def propagate(agentId, universe):
    """Propagate agentId from `time` to `time + timeStep`."""
    time, timeStep, mass, position, velocity = getAgentState(agentId, universe)

    theOthers = [a for a in set(universe) if a != agentId]
    for otherId in theOthers:
        _, _, otherMass, otherPosition, _ = getAgentState(otherId, universe)
        distance = position - otherPosition
        distanceMag = np.linalg.norm(distance)
        # g = 6.67*10**(-11)
        g = 1
        forceMag = g * mass * otherMass / (distanceMag ** 2)
        force = distance / np.linalg.norm(distance) * forceMag

        acceleration = force / mass
        velocity = velocity - (acceleration * timeStep)
    position = position + (velocity * timeStep)

    return {
        'time': time + timeStep,
        # 'timeStep': 0.01+random()*0.09,
        'timeStep': timeStep,
        'mass': mass,
        'x': position[0], 'y': position[1],
        'vx': velocity[0], 'vy': velocity[1]
    }

# DATA STRUCTURE

class QRangeStore:
    """
    A Q-Range KV Store mapping left-inclusive, right-exclusive ranges [low, high) to values.
    Reading from the store returns the collection of values whose ranges contain the query.
    ```
    0  1  2  3  4  5  6  7  8  9
    [A      )[B)            [E)
    [C   )[D   )
           ^       ^        ^  ^
    ```
    >>> store = QRangeStore()
    >>> store[0, 3] = 'Record A'
    >>> store[3, 4] = 'Record B'
    >>> store[0, 2] = 'Record C'
    >>> store[2, 4] = 'Record D'
    >>> store[8, 9] = 'Record E'
    >>> store[2, 0] = 'Record F'
    Traceback (most recent call last):
    IndexError: Invalid Range.
    >>> store[2.1]
    ['Record A', 'Record D']
    >>> store[8]
    ['Record E']
    >>> store[5]
    Traceback (most recent call last):
    IndexError: Not found.
    >>> store[9]
    Traceback (most recent call last):
    IndexError: Not found.
    """
    def __init__(self): self.store = []
    def __setitem__(self, rng, value):
        (low, high) = rng
        if not low < high: raise IndexError("Invalid Range.")
        self.store.append((low, high, value))
    def __getitem__(self, key):
        ret = [v for (l, h, v) in self.store if l <= key < h]
        if not ret: raise IndexError("Not found.")
        return ret

doctest.testmod()

# SIMULATOR

def read(t):
    try:
        data = store[t]
    except IndexError:
        data = []
    return reduce(__or__, data, {})


for i, init in enumerate(inits):
    store = QRangeStore()
    store[-999999999, 0] = init
    times = {agentId: state['time'] for agentId, state in init.items()}

    for _ in range(10**3):
        for agentId in init:
            t = times[agentId]
            universe = read(t-0.001)
            if set(universe) == set(init):
                newState = propagate(agentId, universe)
                store[t, newState['time']] = {agentId: newState}
                times[agentId] = newState['time']

    with open(f'./public/data{i}.json', 'w') as f:
        f.write(json.dumps(store.store, indent=4))