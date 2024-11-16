for path in $(find src -type f | grep "fes"); do mv $path $(echo $path | sed s/fes/fes/g); done
